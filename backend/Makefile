sd:
	serverless deploy
deploy-stage:
	echo "Deploying to stage $(STAGE)"
	serverless deploy --stage $(STAGE)
deploy-all:
	echo "Deploying to all stages"
	serverless deploy --stage dev
	serverless deploy --stage test
	serverless deploy --stage prod
