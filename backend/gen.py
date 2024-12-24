# c.f. https://qiita.com/fukutaro/items/0521f45a5aaed7326e76

import os
import sys

import yaml

sys.path.append("/app")
sys.path.append(os.path.dirname(__file__))
from app.main import app  # noqa: E402


def format_paths(paths: dict) -> dict:
    def format_response(responses: dict) -> dict:
        return {
            status_code if status_code != "422" else "400": contents
            for status_code, contents in responses.items()
        }

    results = {}
    for path, methods in paths.items():
        if path == "/healthcheck":
            continue
        result = {}
        for method, items in methods.items():
            if items.get("responses"):
                result[method] = {
                    **items,
                    "responses": format_response(items["responses"]),
                }
            else:
                result[method] = items
        results[path] = result
    return results


if __name__ == "__main__":
    export_path = "openapi.yml"

    api_json = app.openapi()
    formatted_api_json = {**api_json, "paths": format_paths(api_json["paths"])}
    with open(export_path, mode="w") as f:
        f.write(yaml.dump(formatted_api_json, Dumper=yaml.Dumper, allow_unicode=True))
