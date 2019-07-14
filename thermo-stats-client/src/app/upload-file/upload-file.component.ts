import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UploadService } from "../services/upload/upload.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"]
})
export class UploadFileComponent implements OnInit {
  @ViewChild("file", { static: false })
  file;
  inputFile: File;

  progress;
  canBeClosed = true;
  primaryButtonText = "Upload";
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(public uploadService: UploadService) {}

  ngOnInit() {}

  browseFile() {
    this.file.nativeElement.click();
  }

  onFileChange() {
    this.inputFile = this.file.nativeElement.files[0];
  }

  closeDialog() {
    if (this.primaryButtonText === "Upload") {
      this.uploading = true;
      this.progress = this.uploadService.upload(this.inputFile);

      const allProgressObservables = [];
      for (let key in this.progress) {
        allProgressObservables.push(this.progress[key].progress);
      }
      this.primaryButtonText = "Finish";
      this.showCancelButton = false;
      forkJoin(allProgressObservables).subscribe(end => {
        this.uploadSuccessful = true;
        this.uploading = false;
      });
    } else {
      this.primaryButtonText = "Upload";
      this.showCancelButton = true;
      this.files = new Set();
    }
  }
}
