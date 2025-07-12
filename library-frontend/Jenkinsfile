// Jenkinsfile for library-frontend
// This file should be placed at the root of the library-frontend repository.

// Define global environment variables
def dockerRegistry = "sumitrajneesh" // e.g., "myusername"
def dockerCredentialsId = "3bdc9f350d0642d19dec3a60aa1875b4" // Jenkins credential ID for Docker Hub/GitLab Registry
def sonarqubeServerId = "sonarqube-server" // Jenkins SonarQube server configuration ID
def kubernetesCredentialsId = "kubernetes-credentials" // Jenkins credential ID for Kubernetes access (e.g., Kubeconfig)
def kubernetesContext = "minikube" // Kubernetes context name for your staging cluster
def helmChartPath = "helm/library-frontend-chart" // Path to frontend's Helm chart within its repository

// Pipeline definition
pipeline {
    agent any // Or a specific agent label if you have dedicated build agents

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        skipDefaultCheckout(false)
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo "Installing Node.js dependencies and running React unit tests..."
                        sh "npm install"
                        // `react-scripts test` runs tests and exits.
                        // We use `CI=true` to prevent interactive watch mode.
                        // We configure `jest-junit` in package.json to output XML.
                        sh "CI=true npm test -- --testResultsProcessor=\"jest-junit\""
                    }
                    post {
                        always {
                            // Publish JUnit test results
                            junit '**/test-results/junit.xml'
                        }
                    }
                }

                stage('Code Quality (SonarQube)') {
                    steps {
                        echo "Running SonarQube analysis for React frontend..."
                        withSonarQubeEnv(sonarqubeServerId) {
                            // SonarScanner CLI needs to be installed on the Jenkins agent
                            // sonar.sources=. scans the current directory
                            // sonar.tests=src tells it where test files are
                            sh "sonar-scanner -Dsonar.projectKey=${JOB_NAME} -Dsonar.sources=. -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.login=${SONARQUBE_TOKEN} -Dsonar.tests=src"
                        }
                    }
                    post {
                        always {
                            timeout(time: 5, unit: 'MINUTES') {
                                waitForQualityGate()
                            }
                        }
                    }
                }
            }
        }

        stage('Build React Production Bundle') {
            steps {
                echo "Building React production bundle..."
                sh "npm run build"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def serviceName = env.JOB_NAME.toLowerCase().replaceAll('/', '-')
                    def imageTag = "${env.BRANCH_NAME == 'main' ? 'latest' : env.BRANCH_NAME}-${env.BUILD_NUMBER}".replaceAll('/', '-')
                    def dockerImageName = "${dockerRegistry}/${serviceName}:${imageTag}"

                    echo "Building Docker image: ${dockerImageName}"
                    // Build the Docker image from the current directory, which contains the build output
                    sh "docker build -t ${dockerImageName} ."

                    withCredentials([usernamePassword(credentialsId: dockerCredentialsId, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin ${dockerRegistry.split('/')[0]}"
                        echo "Pushing Docker image: ${dockerImageName}"
                        sh "docker push ${dockerImageName}"
                    }

                    env.DOCKER_IMAGE = dockerImageName
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def serviceName = env.JOB_NAME.toLowerCase().replaceAll('/', '-')
                    def namespace = "staging"

                    echo "Deploying ${serviceName} to Kubernetes staging cluster (${kubernetesContext})..."

                    withKubeConfig(credentialsId: kubernetesCredentialsId, contextName: kubernetesContext) {
                        sh "kubectl create namespace ${namespace} --dry-run=client -o yaml | kubectl apply -f -"

                        // Pass backend service URLs to the frontend as environment variables
                        // These should match the Kubernetes service names for your backend services
                        def bookApiUrl = "/api/books" // Frontend will use Nginx proxy
                        def userApiUrl = "/api/users"
                        def loanApiUrl = "/api/loans"

                        sh "helm upgrade --install ${serviceName} ${helmChartPath} --namespace ${namespace} " +
                           "--set image.repository=${dockerRegistry}/${serviceName} " +
                           "--set image.tag=${env.DOCKER_IMAGE.split(':')[-1]} " +
                           "--set env.REACT_APP_BOOK_API_URL=${bookApiUrl} " +
                           "--set env.REACT_APP_USER_API_URL=${userApiUrl} " +
                           "--set env.REACT_APP_LOAN_API_URL=${loanApiUrl} " +
                           "--wait --timeout 5m"

                        echo "Deployment of ${serviceName} to staging completed."
                        echo "Check the status using: kubectl get pods -n ${namespace} -l app.kubernetes.io/instance=${serviceName}"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo "Pipeline for ${env.JOB_NAME} on branch ${env.BRANCH_NAME} failed. Check logs for details."
        }
        success {
            echo "Pipeline for ${env.JOB_NAME} on branch ${env.BRANCH_NAME} succeeded!"
        }
    }
}
