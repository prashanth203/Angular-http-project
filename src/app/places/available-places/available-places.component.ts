import { Component, signal, inject, OnInit, DestroyRef, resolveForwardRef} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');

  ngOnInit(): void {

      this.isFetching.set(true);
      // returns Observable
      // unless u call .subscribe on the get request, get call wont do anything
      const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')
      .pipe(map( (responseData) =>responseData.places), catchError((error) => {
        console.log(error);
        return throwError(() => new Error('something went wrong while fetching available places. please try again later.'));
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
