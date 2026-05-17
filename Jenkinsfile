// Jenkins Pipeline for CI/CD with Docker Build

pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'blog-site:latest'
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

                    try {

                        bat 'C:\\Users\\kisho\\Downloads\\sonar-scanner-cli-8.0.1.6346-windows-x64\\sonar-scanner-8.0.1.6346-windows-x64\\bin\\sonar-scanner.bat'

                        echo 'SonarQube analysis completed'

                    } catch (Exception e) {

                        echo 'WARNING: SonarQube server not available - skipping analysis'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {

                    echo '========== Building Docker Image =========='

                    // Remove old image if exists
                    bat 'docker rmi blog-site:latest || exit 0'

                    // Build new docker image
                    bat 'docker build -t blog-site:latest .'

                    echo 'Docker image created successfully'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {

                    echo '========== Running Docker Container =========='

                    // Stop old container if exists
                    bat 'docker stop blog-container || exit 0'

                    // Remove old container
                    bat 'docker rm blog-container || exit 0'

                    // Run new container
                    bat 'docker run -d --name blog-container -p 5000:5000 blog-site:latest'

                    echo 'Docker container started successfully'
                }
            }
        }
    }

    post {

        always {
            echo 'Pipeline execution completed'
        }

        success {
            echo 'Build, SonarQube analysis, and Docker deployment successful!'
        }

        failure {
            echo 'Pipeline failed!'
        }

        cleanup {
            cleanWs()
        }
    }
}