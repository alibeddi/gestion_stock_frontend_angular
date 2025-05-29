import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { PermissionCheckService } from "../services/permission/permission-check.service";

@Directive({
  selector: "[appFeatureAccess]",
})
export class FeatureAccessDirective implements OnInit {
  private featureKey: string = "";
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionCheckService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  @Input()
  set appFeatureAccess(featureKey: string) {
    this.featureKey = featureKey;
    this.updateView();
  }

  private updateView(): void {
    // Clear the container first
    this.viewContainer.clear();

    // If no feature key is specified, show the element
    if (!this.featureKey) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Check if user has access to the specified feature
    const hasAccess = this.permissionService.canAccess(this.featureKey);
    console.log(`Feature access check for "${this.featureKey}": ${hasAccess}`);

    if (hasAccess) {
      // Add the template to the view if user has access
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
