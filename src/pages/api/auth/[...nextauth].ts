import NextAuth from "next-auth"
import {DynamoDB, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDBAdapter} from "@next-auth/dynamodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";




const isCorrectCredentials = (credentials: any) => credentials.username === process.env.NEXTAUTH_USERNAME && credentials.password === process.env.NEXTAUTH_PASSWORD;

export default NextAuth({
    debug: true,
    providers: [
        CredentialsProvider({
            type: "credentials",
            id: "credentials",
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                if (isCorrectCredentials(credentials)) {
                    const user = {id: '1', name: "Admin"};
                    return Promise.resolve(user);
                } else {
                    return Promise.resolve(null);

                }
            }
        })
    ]
})
