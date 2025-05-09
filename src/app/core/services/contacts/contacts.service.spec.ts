import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ContactsService } from "./contacts.service";

describe("ContactsService", () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactsService],
    });
    service = TestBed.inject(ContactsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
