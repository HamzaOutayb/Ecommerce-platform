import re

with open('pom.xml', 'r') as f:
    content = f.read()

content = content.replace(
    '<artifactId>spring-boot-starter-mongodb</artifactId>',
    '<artifactId>spring-boot-starter-data-mongodb</artifactId>'
)

content = content.replace(
    '<artifactId>spring-boot-starter-mongodb-test</artifactId>',
    '<artifactId>spring-boot-starter-data-mongodb-test</artifactId>'
)

deps_to_add = """
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
"""

content = content.replace(
    '</dependencies>',
    deps_to_add + '\n\t</dependencies>'
)

with open('pom.xml', 'w') as f:
    f.write(content)

print("pom.xml updated.")
