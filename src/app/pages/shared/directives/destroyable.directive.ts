import {Directive, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

@Directive()
export class DestroyableDirective implements OnDestroy {
  protected readonly unsubscribe$: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
