import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';  // Provide HttpClient
import { provideApollo } from 'apollo-angular';  // Import provideApollo function from apollo-angular
import { InMemoryCache } from '@apollo/client/core';  // Import InMemoryCache from Apollo Client
import { ApolloClientOptions } from '@apollo/client';  // Import ApolloClientOptions for type checking

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => ({
      uri: 'https://one01450921-assignment1.onrender.com/graphql',  // Your GraphQL API URI
      cache: new InMemoryCache(),  // Apollo cache configuration
    }) as ApolloClientOptions<any>),  // Ensure the configuration type is correct
  ],
};
