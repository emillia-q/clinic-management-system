package pl.polsl.clinic.component;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import pl.polsl.clinic.controller.PatientController;
import pl.polsl.clinic.dto.PatientGeneralDto;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class PatientGeneralModelAssembler implements RepresentationModelAssembler<PatientGeneralDto, EntityModel<PatientGeneralDto>> {
	@Override
	public EntityModel<PatientGeneralDto> toModel(PatientGeneralDto patient) {
		EntityModel<PatientGeneralDto> patientModel = EntityModel.of(patient);
		// "self" link gets self
		patientModel.add(linkTo(methodOn(PatientController.class)
			.getById(patient.getId()))
			.withSelfRel());
		// other links
//		patientModel.add(linkTo(methodOn(PatientController.class)
//			.getMatchingBy(null, null, null))
//			.withRel("patients"));
		return patientModel;
	}
}
