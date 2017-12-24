<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'date',
    ];
}
