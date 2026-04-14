import { Component, signal, inject, OnInit, DestroyRef, resolveForwardRef} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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

  ngOnInit(): void {
      // returns Observable
      // unless u call .subscribe on the get request, get call wont do anything
      const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000')
      .pipe(map( (responseData) =>responseData.places))
      .subscribe({
        next: (places) => {
          this.places.set(places);
        }
      });
      this.destroyRef.onDestroy(
        () => {subscription.unsubscribe()}
      );
  }

}
