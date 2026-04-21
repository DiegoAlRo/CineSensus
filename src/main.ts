/* Imports necesarios. */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/* Arranque de la aplicación Angular. */
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));