stoppingContainers () {
	echo "Stopping containers"
	docker-compose --log-level ERROR -p secure-node down --remove-orphans
}

command="$1"
case "${command}" in
    "build")
        npm run build
		export COMPOSE_PROJECT_NAME=secure-node
	    COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build --parallel --progress tty
		;;
	"start")
		stoppingContainers
		export COMPOSE_PROJECT_NAME=secure-node
		docker-compose up --remove-orphans
		;;
	"stop")
		stoppingContainers
		;;
	*)
		echo "Command not Found."
		exit 127;
		;;
esac
