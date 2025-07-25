# Generated by Django 5.2.4 on 2025-07-25 22:08

import ckeditor_uploader.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='About',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video', models.FileField(blank=True, help_text='Upload a video file (MP4, AVI, etc.) to show in the About section.', null=True, upload_to='about/videos/', verbose_name='About Video')),
                ('title', models.CharField(blank=True, help_text='Enter the title or heading for the About section.', max_length=500, null=True, verbose_name='About Title')),
                ('description', ckeditor_uploader.fields.RichTextUploadingField(blank=True, help_text='Provide a detailed description about your organization or purpose.', null=True, verbose_name='About Description')),
            ],
            options={
                'verbose_name': 'About Section',
                'verbose_name_plural': 'About Sections',
                'ordering': ['-id'],
            },
        ),
    ]
