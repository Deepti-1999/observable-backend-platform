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
                    rsync -a --delete --exclude='.git' ./ /home/hfer/backend-app-runtime/
                    sudo -u hfer /usr/bin/pm2 restart backend-app
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking Application Health'

                sh '''
                    curl http://localhost:4000/health
                '''
            }
        }
    }
}
