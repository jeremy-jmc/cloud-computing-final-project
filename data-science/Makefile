rewrite-aws_credentials:
	cp ./credentials ~/.aws/credentials
# echo "$(AWS_CREDENTIALS)" > ~/.aws/credentials
sls_file:
	sls deploy --config $(FILE)
# sls remove --config $(FILE)
dev:
	echo "Deploying to stage 'dev'"
	serverless deploy --stage dev