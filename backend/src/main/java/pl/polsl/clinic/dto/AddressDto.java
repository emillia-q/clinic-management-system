package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Address;

public record AddressDto(
	String city,
	String street,
	String houseNo,
	String apartmentNo
) {
	public static AddressDto fromEntity(Address address) {
		if (address == null) return null;
		return new AddressDto(
			address.getCity(),
			address.getStreet(),
			address.getHouseNo(),
			address.getApartmentNo()
		);
	}
}