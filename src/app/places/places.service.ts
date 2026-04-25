import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong fetching available places. Please try again later');
  }

  loadUserPlaces() {}

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId:
    })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string)
  {
    return this.httpClient.get<{places: Place[]}>(url)
            .pipe(map( (responseData) =>responseData.places), catchError((error) => {
              console.log(error);
              return throwError(() => new Error(errorMessage));
            }
            ))
  }


}
