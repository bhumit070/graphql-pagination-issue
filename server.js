const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const { faker } = require('@faker-js/faker');
const users = []
for (let i = 0; i < 50; i++) {
	const randomUser = {
		id: i + 1,
		name: faker.name.findName(),
		email: faker.internet.email(),
		username: faker.internet.userName()
	}
	users.push(randomUser)
}
const schema = buildSchema(`
	type User {
		id: Int,
		name: String,
		email: String,
		username: String
	}
	type PaginationInfo {
		hasNextPage: Boolean
	}
	type PaginatedUsers {
		edges: [User]
		pageInfo: PaginationInfo
	}
	type Query {
		hello: String,
		world: String,
		users(limit: Int, offset: Int): PaginatedUsers,
		user(id: Int!): User
	}
`)

const root = {
	hello: () => {
		return 'Hello World'
	},
	world: () => {
		return 'World Hello'
	},
	users: (args) => {
		const { limit = 10, offset = 0 } = args
		const askedUsers = users.slice(offset, offset + limit)
		return {
			edges: askedUsers,
			pageInfo: {
				hasNextPage: users.length > offset + limit
			}
		}
	},
	user: (args) => {
		const { id } = args
		const user = users.find(user => user.id === id)
		return user
	}
}

const app = express()

app.use('/graphql', graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true
}))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`app is running ${PORT}...`)
})

