pipeline {
    agent any

    environment {
        IMAGE_NAME = 'blog-site'
        DOCKER_HUB_IMAGE = 'k2027/blog-site'
        CONTAINER_NAME = 'blog-container'
        PORT = '5000'
        ENV_FILE = 'C:\\Users\\kisho\\desktop\\blog-site\\.env'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== Pulling Latest Code =========='
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '========== Building Docker Image =========='
                bat 'docker rmi %IMAGE_NAME%:latest || exit 0'
                bat 'docker build -t %IMAGE_NAME%:latest .'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '========== Running SonarQube Analysis =========='
                script {
                    try {
                        // Get the SonarScanner tool configured in Jenkins
                        def scannerHome = tool 'SonarScanner'
                        
                        // Run SonarQube analysis with environment setup
                        withSonarQubeEnv() {
                            bat "${scannerHome}\\bin\\sonar-scanner.bat"
                        }
                        echo 'SonarQube analysis completed successfully'
                    } catch (Exception e) {
                        echo 'WARNING: SonarQube analysis failed or server unavailable - continuing pipeline'
                        echo "Error: ${e.message}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '========== Pushing Image to Docker Hub =========='
                bat 'docker login -u k2027 -p Wifirit@24'
                bat 'docker tag %IMAGE_NAME%:latest %DOCKER_HUB_IMAGE%:latest'
                bat 'docker push %DOCKER_HUB_IMAGE%:latest'
                echo 'Image pushed to Docker Hub successfully'
            }
        }

        stage('Deploy Container') {
            steps {
                echo '========== Deploying Container =========='
                bat 'docker stop %CONTAINER_NAME% || exit 0'
                bat 'docker rm %CONTAINER_NAME%   || exit 0'
                bat 'docker run -d --name %CONTAINER_NAME% -p %PORT%:%PORT% --env-file %ENV_FILE% %DOCKER_HUB_IMAGE%:latest'
            }
        }
    }

    post {
        success {
            echo '✅ Build, Push and Deployment successful! App running on port 5000'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above'
            bat 'docker logs %CONTAINER_NAME% || exit 0'
        }
        cleanup {
            cleanWs()
        }
    }
}