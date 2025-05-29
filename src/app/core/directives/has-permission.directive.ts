import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { AuthService } from "../services/auth/auth.service";

@Directive({
  selector: "[appHasPermission]",
})
export class HasPermissionDirective implements OnInit {
  private permissions: string[] = [];
  private logicalOp: "AND" | "OR" = "OR";
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  @Input()
  set appHasPermission(permissions: string | string[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  @Input()
  set appHasPermissionOp(op: "AND" | "OR") {
    this.logicalOp = op;
    this.updateView();
  }

  private updateView(): void {
    // Clear the container first
    this.viewContainer.clear();

    // If no permissions are specified, show the element
    if (!this.permissions || this.permissions.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Admin users always have access to everything
    if (this.authService.isAdmin()) {
      console.log("User is admin, permission granted");
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Check if user has required permissions
    let hasPermission: boolean;

    if (this.logicalOp === "OR") {
      hasPermission = this.authService.hasAnyPermission(this.permissions);
    } else {
      hasPermission = this.authService.hasAllPermissions(this.permissions);
    }

    console.log(
      `Permission check for "${this.permissions.join(", ")}" with ${
        this.logicalOp
      } operator: ${hasPermission}`
    );

    if (hasPermission) {
      // Add the template to the view if user has permissions
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
