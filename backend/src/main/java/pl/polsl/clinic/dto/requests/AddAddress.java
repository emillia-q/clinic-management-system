package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pl.polsl.clinic.entity.Address;

@NotNull
public record AddAddress(@NotNull @Size(min = 1, max = 100) String city,
                         @NotNull @Size(min = 1, max = 100) String street,
                         @NotNull String houseNo,
						 String apartmentNo) {

	public Address mapToEntity() {
		Address address = new Address();
		populateAddressFields(address);
		return address;
	}

	public void populateAddressFields(Address address) {
		address.setCity(city);
		address.setStreet(street);
		address.setHouseNo(houseNo);
		address.setApartmentNo(apartmentNo);
	}
}
