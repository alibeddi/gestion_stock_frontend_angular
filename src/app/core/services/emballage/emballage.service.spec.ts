import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { EmballageService } from "./emballage.service";

describe("EmballageService", () => {
  let service: EmballageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmballageService],
    });
    service = TestBed.inject(EmballageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
