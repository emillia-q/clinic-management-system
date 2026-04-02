package pl.polsl.clinic.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "LabManager")
public class LabManager extends Staff {}
