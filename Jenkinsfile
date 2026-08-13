pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
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
                    sudo -n -u hfer /home/hfer/deploy-backend.sh
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking Application Health'

                sh '''
                    for i in {1..10}; do
                        if curl -sf http://localhost:4000/health; then
                           exit 0
                        fi

                        echo "Application not ready yet. Retrying..."
                        sleep 2
                    done

                    echo "Application failed health check"
                    exit 1
                '''
            }
        }
    }
}
