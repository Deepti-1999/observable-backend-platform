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
                echo 'Deployment Stage'
                sh 'date'
            }
        }
    }
}
