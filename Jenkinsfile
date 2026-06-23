pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Application'
                sh 'pwd'
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
