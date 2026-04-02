package pl.polsl.clinic.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "LabTechnician")
public class LabTechnician extends Staff {}
