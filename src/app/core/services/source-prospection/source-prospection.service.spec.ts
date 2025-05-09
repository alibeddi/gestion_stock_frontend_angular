import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { SourceProspectionService } from "./source-prospection.service";

describe("SourceProspectionService", () => {
  let service: SourceProspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SourceProspectionService],
    });
    service = TestBed.inject(SourceProspectionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
