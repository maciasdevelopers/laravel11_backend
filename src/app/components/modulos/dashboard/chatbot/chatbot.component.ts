import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: false
})
export class ChatbotComponent implements OnInit {
  chatVisible: boolean = false;
  chatForm: FormGroup;
  areas: any[] = [
    { label: 'Ingresos', value: 'ingresos' },
    { label: 'Egresos', value: 'egresos' },
    { label: 'Finanzas', value: 'finanzas' },
    { label: 'Valor Humano', value: 'vhumano' },
    { label: 'Contabilidad', value: 'contabilidad' },
    { label: 'Soporte SOS', value: 'soporte' }
  ];

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      area: [null, Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  enviarMensaje() {
    if (this.chatForm.valid) {
      console.log('Mensaje enviado:', this.chatForm.value);
      // Aquí iría la lógica para enviar el mensaje
      this.chatForm.reset();
      this.chatVisible = false;
    }
  }
}
