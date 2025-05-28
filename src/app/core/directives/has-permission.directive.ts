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

    // Debug information
    console.log(
      "HasPermissionDirective checking permissions:",
      this.permissions
    );
    console.log("User object:", this.authService.getCachedUser());
    console.log("Is Admin?", this.authService.isAdmin());

    // If no permissions are required, show the element
    if (!this.permissions || this.permissions.length === 0) {
      console.log("No permissions required, showing element");
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    const hasPermission =
      this.logicalOp === "AND"
        ? this.authService.hasAllPermissions(this.permissions)
        : this.authService.hasAnyPermission(this.permissions);

    console.log("Has permission?", hasPermission);

    // Admin always has access
    const isAdmin = this.authService.isAdmin();
    console.log("Admin check in directive:", isAdmin);

    if (hasPermission || isAdmin) {
      console.log("User has permission or is admin, showing element");
      // Add the template to the view
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      console.log("User does not have permission, hiding element");
    }
  }
}
