
pipeline {
    agent any
    options {
    skipDefaultCheckout(true)
}

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub'
                checkout scm
            }
        }

        stage('Frontend Validation') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run lint'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Validation') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'node --check server.js'
                }
            }
        }

        stage('ML Service Validation') {
            steps {
                dir('ml-service') {
                    bat 'python -m compileall -q .'
                }
            }
        }
    }

    post {
        success {
            echo 'All pipeline stages completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
