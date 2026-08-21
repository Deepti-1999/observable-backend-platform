pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging'],
            description: 'Select deployment environment'
        )
    }

    environment {
        APP_NAME = 'backend-app'
        APP_PORT = '4000'
        DEPLOY_DIR = "${params.ENVIRONMENT == 'dev' ? '/home/hfer/backend-app-runtime-dev' : '/home/hfer/backend-app-runtime-staging'}"
        DEPLOY_ENV = "${params.ENVIRONMENT}"
    }

    stages {

        stage('Build') {
            steps {
                echo "Deployment Environment: ${DEPLOY_ENV}"

                withCredentials([
                    string(
                       credentialsId: 'backend-demo-secret',
                       variable: 'DEMO_SECRET'
                    )
                )] {
                    sh '''
	               echo "Credential is available to the pipeline"
                       echo "Secret length: ${#DEMO_SECRET}"
                    '''
                }
                echo 'Installing Dependencies'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Checking Node Version'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Application'

                sh '''
                    sudo -n -u hfer /home/hfer/deploy-backend.sh "$WORKSPACE" "$DEPLOY_DIR" "$APP_NAME"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking Application Health'

                sh '''
                    for i in $(seq 1 15); do
                        if curl -sf http://localhost:$APP_PORT/health; then
                           echo "Application is healthy"
                           exit 0
                        fi

                        echo "Application not ready yet. Attempt $i/15. Retrying..."
                        sleep 2
                    done

                    echo "Application failed health check after 30 seconds"
                    exit 1
                '''
            }
        }
    }
}
