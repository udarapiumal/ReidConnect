package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "keystore")
@Getter
@Setter
public class KeyStoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "keystore_seq")
    @SequenceGenerator(name = "keystore_seq", sequenceName = "keystore_seq", allocationSize = 1)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(name = "public_key", nullable = false, columnDefinition = "TEXT")
    private String publicKey;

    @Column(name = "private_key", nullable = false, columnDefinition = "TEXT")
    private String privateKey;

}

// @Entity
// @Table(name = "keystore")
// public class KeyStoreEntity {
//
// @Id
// @GeneratedValue(strategy = GenerationType.SEQUENCE, generator =
// "keystore_seq")
// @SequenceGenerator(name = "keystore_seq", sequenceName = "keystore_seq",
// allocationSize = 1)
// private Long id;
//
// @OneToOne(fetch = FetchType.LAZY)
// @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false,
// unique = true)
// private User user;
//
// @Column(name = "public_key", nullable = false, columnDefinition = "TEXT")
// private String publicKey;
//
// @Column(name = "private_key", nullable = false, columnDefinition = "TEXT")
// private String privateKey;
//
// // Default constructor
// public KeyStoreEntity() {}
//
// // Getters and Setters
// public Long getId() {
// return id;
// }
//
// public void setId(Long id) {
// this.id = id;
// }
//
// public User getUser() {
// return user;
// }
//
// public void setUser(User user) {
// this.user = user;
// }
//
// public String getPublicKey() {
// return publicKey;
// }
//
// public void setPublicKey(String publicKey) {
// System.out.println("🔍 Setting publicKey - length: " + (publicKey != null ?
// publicKey.length() : "null"));
// this.publicKey = publicKey;
// }
//
// public String getPrivateKey() {
// return privateKey;
// }
//
// public void setPrivateKey(String privateKey) {
// System.out.println("🔍 Setting privateKey - length: " + (privateKey != null ?
// privateKey.length() : "null"));
// if (privateKey != null && privateKey.length() > 20) {
// System.out.println("🔍 Setting privateKey - preview: " +
// privateKey.substring(0, 20) + "...");
// } else {
// System.out.println("🔍 Setting privateKey - full value: '" + privateKey +
// "'");
// }
// this.privateKey = privateKey;
// }
// }