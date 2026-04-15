package pl.polsl.clinic.component;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import pl.polsl.clinic.controller.PatientController;
import pl.polsl.clinic.dto.PatientDto;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class PatientModelAssembler implements RepresentationModelAssembler<PatientDto, EntityModel<PatientDto>> {
	@Override
	public EntityModel<PatientDto> toModel(PatientDto patient) {
		EntityModel<PatientDto> patientModel = EntityModel.of(patient);
		// "self" link
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
