package com.thuongmaidientu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "slug", length = 50, nullable = false)
    private String slug;

    @Column(name = "sort_desc", columnDefinition = "TEXT", nullable = false)
    private String sortDesc;

    @Column(name = "image", length = 100, nullable = false)
    private String image;

    @Column(name = "details", columnDefinition = "TEXT", nullable = false)
    private String details;

    @Column(name = "create_at", nullable = false, updatable = false)
    @Temporal(TemporalType.DATE)
    private Date createAt = new Date();

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "trash", length = 10, nullable = false)
    private String trash = "active";

    @Column(name = "deleted_at", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date deletedAt;
    
    @OneToMany(mappedBy = "article")
    private List<CommentArticleEntity> listComment = new ArrayList<>();
}
