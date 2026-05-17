// Jenkins Pipeline for CI/CD (Windows Version)
// This pipeline automates the build and deployment process
// Uses 'bat' for Windows commands instead of 'sh' for Linux

pipeline {
  // Run on any available agent
  agent any

  // Set environment variables
  environment {
    // Docker image name
    DOCKER_IMAGE = 'blog-site:latest'
    
    // Docker registry
    DOCKER_REGISTRY = 'localhost:5000'
    
    // Application port
    APP_PORT = '5000'
  }

  // Pipeline stages
  stages {
    // Stage 1: Checkout code from repository
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // Stage 2: Install dependencies
    stage('Install Dependencies') {
      steps {
        script {
          echo '========== Installing Dependencies =========='
          // Install npm packages - using bat for Windows
          bat 'npm install'
        }
      }
    }

    // Stage 3: SonarQube Analysis
    stage('SonarQube Analysis') {
      steps {
        script {
          echo '========== Running SonarQube Analysis =========='
          // Run SonarQube scanner - using bat for Windows
          bat 'sonar-scanner'
        }
      }
    }

    // Stage 4: Build Docker image
    stage('Docker Build') {
      steps {
        script {
          echo '========== Building Docker Image =========='
          // Build Docker image with tag - using bat for Windows
          bat "docker build -t ${DOCKER_IMAGE} ."
          
          // Optional: Tag image for registry
          bat "docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}"
        }
      }
    }

    // Stage 5: Run application tests (optional)
    stage('Run Application') {
      steps {
        script {
          echo '========== Running Application =========='
          echo 'Application ready for deployment'
          
          // Optional: Run health check using batch
          // bat 'curl http://localhost:5000/api/health'
        }
      }
    }
  }

  // Post-build actions
  post {
    // Always run (success or failure)
    always {
      echo 'Pipeline execution completed'
    }

    // Run on success
    success {
      echo 'Build and SonarQube analysis successful!'
    }

    // Run on failure
    failure {
      echo 'Build, analysis, or deployment failed!'
    }

    // Clean up
    cleanup {
      // Clean workspace after build
      cleanWs()
    }
  }
}
