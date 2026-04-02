package pl.polsl.clinic.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Receptionist")
public class Receptionist extends Staff {}
