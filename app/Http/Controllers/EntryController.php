<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Entry;

class EntryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entries = Entry::all();
        return response()->json($entries);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $entry = new Entry([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'category' => $request->get('category'),
            'price' => $request->get('price'),
            'date' => $request->get('date'),
        ]);
        $entry->save();
        return response()->json($entry);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $entry = Entry::find($id);
        return response()->json($entry);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $entry = Entry::find($id);
        $entry->name = $request->get('name');
        $entry->description = $request->get('description');
        $entry->category = $request->get('category');
        $entry->price = $request->get('price');
        $entry->date = $request->get('date');
        $entry->save();

        return response()->json('Succesfully updated');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $entry = Entry::find($id);
        $entry->delete();

        return response()->json($entry);
    }
}
