OAS_INPUT_FILE := docs/openapi.yml
OAS_GENERATOR := typescript-fetch
OAS_OUTPUT_DIR := frontend/src/gen/api
OAS_OUTPUT_DIR_WINDOWS := frontend\src\gen\api
OAS_CONFIG_FILE := frontend/openapi-config.yml
OAS_TEMPLATE_FILE := docs/openapi-generator-6.6.0/templates/typescript-fetch

DOCKER_RUN_OAS_CLI := docker run --rm -v "${CURDIR}:/local" openapitools/openapi-generator-cli:v7.2.0

RM := rm -rf $(OAS_OUTPUT_DIR)
ifeq ($(OS),Windows_NT)
	RM = rmdir /s /q $(OAS_OUTPUT_DIR_WINDOWS)
endif

## OAS定義ファイルを検証
.PHONY: validate-api-client
validate-api-client: 
	$(DOCKER_RUN_OAS_CLI) validate \
		-i /local/$(OAS_INPUT_FILE)

## OAS定義ファイルからAPIクライアントを自動生成
.PHONY: generate-api-client
generate-api-client: 
	$(RM)
	$(DOCKER_RUN_OAS_CLI) generate \
		-i /local/$(OAS_INPUT_FILE) \
		-g $(OAS_GENERATOR) \
		-o /local/$(OAS_OUTPUT_DIR) \
		-c /local/$(OAS_CONFIG_FILE) \
		-t /local/$(OAS_TEMPLATE_FILE)
