import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Permission } from "./permission.service";

@Component({
  selector: "app-permission-form-dialog",
  templateUrl: "./permission-form-dialog.component.html",
  styleUrls: ["./permission-form-dialog.component.scss"],
})
export class PermissionFormDialogComponent implements OnInit {
  permissionForm!: FormGroup;
  isEdit = false;
  categories = [
    "Users",
    "Clients",
    "Prospects",
    "Products",
    "Quotes",
    "Settings",
    "Roles",
    "Permissions",
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PermissionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Permission
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data.id;
    this.initForm();
  }

  initForm(): void {
    this.permissionForm = this.fb.group({
      id: [this.data.id],
      name: [
        this.data.name || "",
        [Validators.required, Validators.pattern(/^[a-z0-9:-]+$/)],
      ],
      description: [this.data.description || ""],
      category: [this.data.category || "", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.permissionForm.invalid) return;
    this.dialogRef.close(this.permissionForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
