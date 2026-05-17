// Jenkins Pipeline for CI/CD (Windows Version)

pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'blog-site:latest'
        DOCKER_REGISTRY = 'localhost:5000'
        APP_PORT = '5000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '========== Installing Dependencies =========='
                    bat 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo '========== Running SonarQube Analysis =========='

                    bat 'C:\\Users\\kisho\\Downloads\\sonar-scanner-cli-8.0.1.6346-windows-x64\\sonar-scanner-8.0.1.6346-windows-x64\\bin\\sonar-scanner.bat'
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo '========== Building Docker Image =========='

                    bat "docker build -t ${DOCKER_IMAGE} ."

                    bat "docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}"
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    echo '========== Running Application =========='
                    echo 'Application ready for deployment'
                }
            }
        }
    }

    post {

        always {
            echo 'Pipeline execution completed'
        }

        success {
            echo 'Build and SonarQube analysis successful!'
        }

        failure {
            echo 'Build, analysis, or deployment failed!'
        }

        cleanup {
            cleanWs()
        }
    }
}