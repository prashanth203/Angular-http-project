import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');


  ngOnInit(): void {
  
        this.isFetching.set(true);
        // returns Observable
        // unless u call .subscribe on the get request, get call wont do anything
        const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/user-places')
        .pipe(map( (responseData) =>responseData.places), catchError((error) => {
          console.log(error);
          return throwError(() => new Error('something went wrong while fetching your favourite places. please try again later.'));
        }
        ))
        .subscribe({
          next: (places) => {
            this.places.set(places);
          },
          error: (error: Error) => {
            this.error.set(error.message);
  
          },
          complete: () =>
          {
            this.isFetching.set(false);
          }
        });
        this.destroyRef.onDestroy(
          () => {subscription.unsubscribe()}
        );
    }
  
    onSelectPlace(selectedPlace : Place)
    {
      this.httpClient.put('http://localhost:3000/user-places', {
        placeId: selectedPlace.id
      }).subscribe(
        {
          next: (resData) => console.log(resData),
        }
      );
    }
  
  
}
