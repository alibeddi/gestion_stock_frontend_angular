import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ProspectService } from "./prospect.service";

describe("ProspectService", () => {
  let service: ProspectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProspectService],
    });
    service = TestBed.inject(ProspectService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
