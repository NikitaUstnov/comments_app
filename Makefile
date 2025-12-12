.PHONY: up down logs build clean restart

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

build:
	docker-compose build --no-cache

clean:
	docker-compose down -v
	docker system prune -f

restart:
	docker-compose restart
```

---

## .dockerignore
```
node_modules
dist
.git
.env
*.log
coverage
.DS_Store