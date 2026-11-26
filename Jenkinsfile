
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
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

        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'vercel-token',
                        variable: 'VERCEL_TOKEN'
                    )
                ]) {
                    withEnv([
                        'VERCEL_ORG_ID=team_KBimKVd4KZbpOMmjF3it6GCM',
                        'VERCEL_PROJECT_ID=prj_lWcnCsJHWUgDKDUgfDg7SL4EHoxA'
                    ]) {
                        bat 'npx --yes vercel@67.0.0 deploy --prod --yes --token="%VERCEL_TOKEN%"'
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'vercel-token',
                        variable: 'VERCEL_TOKEN'
                    )
                ]) {
                    withEnv([
                        'VERCEL_ORG_ID=team_KBimKVd4KZbpOMmjF3it6GCM',
                        'VERCEL_PROJECT_ID=prj_hajI7cNADbBYtd0gA3kFYRJ2814O'
                    ]) {
                        bat 'npx --yes vercel@67.0.0 deploy --prod --yes --token="%VERCEL_TOKEN%"'
                    }
                }
            }
        }

        stage('Deploy ML Service') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'vercel-token',
                        variable: 'VERCEL_TOKEN'
                    )
                ]) {
                    withEnv([
                        'VERCEL_ORG_ID=team_KBimKVd4KZbpOMmjF3it6GCM',
                        'VERCEL_PROJECT_ID=prj_w685hNlDmvvTiihJ9PbQ0PYMm7om'
                    ]) {
                        bat 'npx --yes vercel@67.0.0 deploy --prod --yes --token="%VERCEL_TOKEN%"'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'CI passed and all three production deployments completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}
