import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { SecteurActiviteService } from "./secteur-activite.service";

describe("SecteurActiviteService", () => {
  let service: SecteurActiviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecteurActiviteService],
    });
    service = TestBed.inject(SecteurActiviteService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
