package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "staff")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public class Staff {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "login", nullable = false, unique = true, length = 100)
    private String login;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "is_active", nullable = false, length = 1)
    private String isActive = "Y";

    @Column(name = "user_type", nullable = false, length = 50)
    private String userType;
}