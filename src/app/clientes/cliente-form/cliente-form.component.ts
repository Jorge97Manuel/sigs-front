import { ClientesService } from './../clientes.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
  preserveWhitespaces: true
})
export class ClienteFormComponent implements OnInit, OnDestroy {

  $unsub = new Subject();
  form!: FormGroup;
  cliente: Cliente = {
    id: 0,
    nome: '',
    bi: '',
    telefone: 0,
    email: '',
    dataCadastro: ''
  };

  success: boolean = false;
  errors!: String[];
  constructor(
    private fb: FormBuilder,
    private service: ClientesService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [null, [Validators.required, Validators.maxLength(9)]],
      bi: ['', [Validators.required, Validators.maxLength(14)]]
    })
  }

  onSubmit() {
    this.service.create(this.form.value).pipe(
      takeUntil(this.$unsub)
      ).subscribe(response => {
      this.router.navigate(['/clientes/listar']);
      this.success = true;
      this.errors = [];
    },
      errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
      })
  }
  onCancel() {
    this.router.navigate(['/clientes/listar']);

  }

  ngOnDestroy(): void {
    this.$unsub.next();
    this.$unsub.complete();
  }

}
